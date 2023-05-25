import requests
import pandas as pd
import json
import urllib.request
# url define
url1 = 'https://data.wa.gov/resource/3d5d-sdqb.json'
url2 = 'https://data.wa.gov/resource/f6w7-q2d2.geojson'
url3 = 'https://data.wa.gov/resource/f6w7-q2d2.json'

# fist datasetoutput
# Load json from url
with urllib.request.urlopen(url1) as url:
    data = json.loads(url.read().decode())
# Convert list of dictionaries to DataFrame
df = pd.DataFrame(data)
# Export CSV
df.to_csv('dataCollect/Size_History_By_County.csv', header = True, index = False)
# Convert DataFrame to JSON
json_data = df.to_json(orient="records")
# Export JSON
with open('dataCollect/Size_History_By_County.json', 'w') as f:
    f.write(json_data)

# second dataset output
response = requests.get(url2)
with open('dataCollect/Population_Data.geojson', 'wb') as file:
    file.write(response.content)

# third dataset output
# Load json from url
with urllib.request.urlopen(url3) as url:
    data = json.loads(url.read().decode())
# Convert list of dictionaries to DataFrame
df = pd.DataFrame(data)
# Export CSV
df.to_csv('dataCollect/Population_Data.csv', header = True, index = False)
# Convert DataFrame to JSON
json_data = df.to_json(orient="records")
# Export JSON
with open('dataCollect/Population_Data.json', 'w') as f:
    f.write(json_data)