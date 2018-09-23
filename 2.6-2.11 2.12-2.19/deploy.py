import shutil
import subprocess
import os
os.system("npm run build")
#subprocess.call(["npm","run","build"])
try:
	shutil.rmtree('../../luento3/build')
except:
	pass
shutil.copytree('build','../../luento3/build')