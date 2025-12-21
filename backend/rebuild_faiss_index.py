"""
Script to rebuild the FAISS index from MongoDB product data.

This script:
1. Connects to MongoDB and fetches all products
2. Downloads product images from Cloudinary URLs
3. Generates embeddings using the same model as the main application
4. Builds and saves a new FAISS index and CID mapping

Run this script when:
- New products are added to MongoDB
- The embedding model is updated
- The index needs to be regenerated
"""

import os
import io
import sys
import logging

import numpy as np
import faiss
import requests
from PIL import Image
from dotenv import load_dotenv

# Add parent directory to path for model imports
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from models import similarity_module as similarity

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    stream=sys.stdout,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ResNet50 embedding dimension
EMBEDDING_DIMENSION = 2048

# Request timeout for image downloads (seconds)
IMAGE_DOWNLOAD_TIMEOUT = 10

# Progress logging interval
PROGRESS_LOG_INTERVAL = 100


def download_image_from_url(image_url):
    """
    Download an image from a URL and return it as a PIL Image.

    Args:
        image_url (str): URL of the image to download

    Returns:
        PIL.Image or None: Downloaded image, or None if download fails
    """
    try:
        response = requests.get(
            image_url,
            stream=True,
            timeout=IMAGE_DOWNLOAD_TIMEOUT
        )
        response.raise_for_status()
        image = Image.open(io.BytesIO(response.content)).convert("RGB")
        return image

    except requests.exceptions.RequestException as error:
        logger.error(f"Error downloading image from {image_url}: {error}")
        return None

    except Image.UnidentifiedImageError:
        logger.error(
            f"Cannot identify image from {image_url}. "
            "It might be corrupted or not an image."
        )
        return None

    except Exception as error:
        logger.error(
            f"Unexpected error processing image from {image_url}: {error}"
        )
        return None


def rebuild_index():
    """
    Rebuild the FAISS index from MongoDB product data.

    This function:
    1. Connects to MongoDB
    2. Loads the image embedding model
    3. Processes all products and generates embeddings
    4. Builds and saves the FAISS index
    """
    logger.info("Starting FAISS index rebuilding process...")

    # Initialize MongoDB connection
    mongo_collection = similarity.get_mongo_collection()
    if mongo_collection is None:
        logger.critical("Failed to connect to MongoDB. Exiting.")
        sys.exit(1)

    # Load image embedding model
    # This ensures consistency with the main application
    embedding_model, image_transform, device = (
        similarity.load_image_embedding_model_and_transform()
    )
    if embedding_model is None:
        logger.critical("Failed to load image embedding model. Exiting.")
        sys.exit(1)

    embeddings = []
    product_ids = []

    # Fetch all products from MongoDB
    logger.info("Fetching product data from MongoDB...")
    cursor = mongo_collection.find({}, {'cloudinary_url': 1})
    total_products = mongo_collection.count_documents({})
    logger.info(f"Found {total_products} products in MongoDB.")

    processed_count = 0
    skipped_count = 0

    # Process each product
    for document in cursor:
        product_id = str(document.get('_id'))
        image_url = document.get('cloudinary_url')

        if not image_url:
            logger.warning(
                f"Product {product_id} has no 'cloudinary_url'. Skipping."
            )
            skipped_count += 1
            continue

        try:
            # Download and process image
            pil_image = download_image_from_url(image_url)
            if pil_image is None:
                skipped_count += 1
                continue

            # Generate embedding using the same function as the app
            embedding = similarity.get_image_embedding(pil_image)
            embeddings.append(embedding.flatten())
            product_ids.append(product_id)

            processed_count += 1

            # Log progress periodically
            if processed_count % PROGRESS_LOG_INTERVAL == 0:
                logger.info(
                    f"Processed {processed_count}/{total_products} images. "
                    f"Skipped: {skipped_count}"
                )

        except Exception as error:
            logger.error(
                f"Error processing product {product_id} from URL {image_url}: {error}",
                exc_info=True
            )
            skipped_count += 1
            continue

    # Verify we have embeddings to build the index
    if not embeddings:
        logger.critical(
            "No embeddings were generated. Cannot build FAISS index."
        )
        sys.exit(1)

    # Convert to numpy arrays
    embeddings_array = np.array(embeddings).astype('float32')
    product_ids_array = np.array(product_ids, dtype=object)

    logger.info(
        f"Finished generating embeddings. "
        f"Processed: {processed_count}, Skipped: {skipped_count}"
    )
    logger.info(
        f"Building FAISS index with {embeddings_array.shape[0]} embeddings "
        f"of dimension {embeddings_array.shape[1]}..."
    )

    # Build FAISS index using refactored module
    from models.vector_index import create_vector_index
    index = create_vector_index(embeddings_array, product_ids)

    # Save index and mapping to data directory
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_directory = os.path.join(project_root, "data")
    os.makedirs(data_directory, exist_ok=True)

    index_path = os.path.join(data_directory, "faiss_index.bin")
    mapping_path = os.path.join(data_directory, "cid_map.npy")

    faiss.write_index(index, index_path)
    np.save(mapping_path, product_ids_array)

    logger.info(f"FAISS index saved to {index_path}")
    logger.info(f"CID map saved to {mapping_path}")
    logger.info("FAISS index rebuilding process completed successfully!")


if __name__ == "__main__":
    rebuild_index()
