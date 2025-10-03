from fastapi import APIRouter, HTTPException
from app.services.hostaway import HostawayClient

router = APIRouter()
client = HostawayClient()

@router.get("/properties/{property_id}")
async def get_property(property_id: int):
    try:
        property_data = await client.get_property(property_id)
        return {"status": "success", "data": property_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
