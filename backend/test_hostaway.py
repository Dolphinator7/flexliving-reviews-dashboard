import requests

url = "https://api.hostaway.com/v1/reviews"
headers = {
    "Content-Type": "application/json",
    "X-ACCOUNT-ID": "61148",
    "X-API-KEY": "f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152"
}

resp = requests.get(url, headers=headers)

print("Status Code:", resp.status_code)
try:
    print("Response JSON:", resp.json())
except Exception:
    print("Raw Response:", resp.text)
