import subprocess, re
regex = re.compile('xlrd [(]\d[.]\d[.]\d[)]')
cmd = ['pip', 'list']
cmd_popen = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
out, err = cmd_popen.communicate()

xlrd_install_flag = True if regex.search(out) else False

if xlrd_install_flag:
	print 'Creating Folder'
	cmd = ['python', 'create_folder.py']
	cmd_popen = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
	out, err = cmd_popen.communicate()
	print out
else:
	print 'Please Install'
	cmd = ['pip', 'install', 'xlrd']
	cmd_popen = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
	out, err = cmd_popen.communicate()
	print out