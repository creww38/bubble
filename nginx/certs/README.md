# SSL Certificates

Letakkan file SSL certificate di folder ini:

- `bubble.edu.pem` - Full chain certificate
- `bubble.edu.key` - Private key

## Development

Untuk development lokal, generate self-signed certificate:

```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout bubble.edu.key \
  -out bubble.edu.pem \
  -subj "/CN=localhost"