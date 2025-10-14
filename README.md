# FileServer

### How to use

Upload
```
curl -F "file=@myfile.txt" http://localhost:3000/upload
# => Example: 123e4567-e89b-12d3-a456-426614174000
```

Download
```
wget http://localhost:3000/download/<ID>
# => Example: wget http://localhost:3000/download/123e4567-e89b-12d3-a456-426614174000
```
