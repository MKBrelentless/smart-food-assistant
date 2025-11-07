import requests
try:
    r = requests.get('http://localhost:5001', timeout=5)
    print('STATUS', r.status_code)
    print(r.text[:500])
except Exception as e:
    print('ERR', e)
