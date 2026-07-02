"""Deploy loze-vue-homepage to Alibaba Cloud ECS via Docker nginx."""
import paramiko, os, tarfile, re, sys, time

# ── Config ──
HOST = '112.124.53.155'
USER = 'root'
PORT = 80
CONTAINER = 'loze-homepage'
REMOTE_DIR = '/opt/loze-homepage'
LOCAL_DIST = r'C:\Users\Loze\projects\loze-vue-homepage\dist'

# ── Read password ──
deploy_file = r"D:\JAVAEE\demo\deploy_final.py"
with open(deploy_file, encoding='utf-8') as f:
    code = f.read()
m = re.search(r'PASSWORD\s*=\s*["\']([^"\']+)["\']', code)
if not m:
    print("PASSWORD NOT FOUND")
    sys.exit(1)
PASSWORD = m.group(1)

print(f"Deploying loze-vue-homepage to {HOST}:{PORT}")

# ── Step 1: tar dist ──
print("Packing dist/ ...")
tar_path = os.path.join(os.path.dirname(LOCAL_DIST), 'loze-dist.tar.gz')
with tarfile.open(tar_path, 'w:gz') as tar:
    for root, dirs, files in os.walk(LOCAL_DIST):
        for f in files:
            full = os.path.join(root, f)
            arcname = os.path.relpath(full, LOCAL_DIST)
            tar.add(full, arcname)
size_mb = os.path.getsize(tar_path) / 1024 / 1024
print(f"   {size_mb:.1f} MB")

# ── Step 2: SSH upload ──
print(f"Uploading to {REMOTE_DIR} ...")
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASSWORD, timeout=30)

ssh.exec_command(f'mkdir -p {REMOTE_DIR}')
time.sleep(0.5)

sftp = ssh.open_sftp()
sftp.put(tar_path, f'{REMOTE_DIR}/dist.tar.gz')
sftp.close()
print("   Uploaded")

# ── Step 3: Extract + Docker run ──
print("Extracting & starting nginx ...")
stdin, stdout, stderr = ssh.exec_command(
    f'cd {REMOTE_DIR} && tar -xzf dist.tar.gz && '
    f'docker stop {CONTAINER} 2>/dev/null; '
    f'docker rm {CONTAINER} 2>/dev/null; '
    f'docker run -d --name {CONTAINER} --restart unless-stopped '
    f'-p {PORT}:80 -v {REMOTE_DIR}:/usr/share/nginx/html:ro nginx:alpine'
)
out = stdout.read().decode()
err = stderr.read().decode()
if out: print(out.strip())
if err: print("ERR:", err[:300])

# ── Step 4: Verify ──
time.sleep(2)
stdin, stdout, stderr = ssh.exec_command(
    f'docker ps --filter name={CONTAINER} --format "{{{{.Status}}}}"'
)
status = stdout.read().decode().strip()
print(f"\nStatus: {status}")
print(f"http://{HOST}:{PORT}/")

ssh.close()
os.remove(tar_path)
