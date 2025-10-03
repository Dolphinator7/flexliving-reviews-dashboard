"""Property API endpoints"""
from fastapi import APIRouter, HTTPException
from app.models.property import Property

router = APIRouter()

# Mock property data
MOCK_PROPERTIES = [
    Property(
        id="prop_001",
        name="Luxury Downtown Loft",
        address="123 Main St",
        city="New York",
        image_url="/placeholder.svg?height=400&width=600",
        total_reviews=45,
        average_rating=4.7
    ),
    Property(
        id="prop_002",
        name="Beachfront Villa",
        address="456 Ocean Drive",
        city="Miami",
        image_url="/placeholder.svg?height=400&width=600",
        total_reviews=38,
        average_rating=4.9
    ),
    Property(
        id="prop_003",
        name="Mountain Retreat Cabin",
        address="789 Pine Road",
        city="Aspen",
        image_url="/placeholder.svg?height=400&width=600",
        total_reviews=52,
        average_rating=4.6
    ),
]


@router.get("/properties", response_model=list[Property])
async def get_properties():
    """Get all properties"""
    return MOCK_PROPERTIES


@router.get("/properties/{property_id}", response_model=Property)
async def get_property(property_id: str):
    """Get a single property by ID"""
    property_obj = next((p for p in MOCK_PROPERTIES if p.id == property_id), None)
    
    if not property_obj:
        raise HTTPException(status_code=404, detail="Property not found")
    
    return property_obj
