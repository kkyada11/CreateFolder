import os, datetime, subprocess, re

xlrd_regex = re.compile('xlrd [(]\d[.]\d[.]\d[)]')
xlsx_regex = re.compile('[.]xlsx')
cmd = ['pip', 'list']
cmd_popen = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
out, err = cmd_popen.communicate()

xlrd_install_flag = True if xlrd_regex.search(out) else False

if xlrd_install_flag:
	import xlrd
	root = raw_input('Please enter the parent folder name. : ')
	fileName = raw_input('Please enter your Excel file. : ')
	fileName = fileName if fileName else 'temp.xlsx'
	if os.path.isfile(fileName):
		file = xlrd.open_workbook(fileName, encoding_override='utf8')
		file_sheet = file.sheet_by_index(0)
		rows = file_sheet.nrows
		row_arr = []

		for row_num in range(rows):
			row = file_sheet.row_values(row_num)
			for v in row:
				now = datetime.datetime.now()
				nowDate = now.strftime('%Y-%m-%d')
				root = root if root else nowDate

				if not os.path.isdir(root):
					os.mkdir(root)
				if not os.path.isdir(root + '/' + v.encode('utf8')):
					row_arr.append(root + '/' + v.encode('utf8'))

		for folder_item in row_arr:
			print 'Create folder ' + folder_item
			os.mkdir(folder_item)
	else:
		print 'Can Not file'
else:
	print 'Please Install'
	cmd = ['pip', 'install', 'xlrd']
	cmd_popen = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
	out, err = cmd_popen.communicate()
	print err
	print out

