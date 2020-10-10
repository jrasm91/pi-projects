#!/usr/bin/python3
from PIL import Image
from PIL import ImageFont
from PIL import ImageDraw
from multiprocessing import Process, Queue
import multiprocessing as mp
import os
import sys
import time

base_path = os.path.abspath(os.path.join('..', 'images',))
font_path = "/usr/share/fonts/truetype/freefont/FreeSans.ttf"
if os.name == 'nt':
	base_path = 'C:\\___Raspberry PI\\Camera'
	font_path = "C:\\Windows\Fonts\\arial.ttf"
core_count = mp.cpu_count()
font = ImageFont.truetype(font_path, 76)
fontsmall = ImageFont.truetype(font_path, 36)
fontcolor = (238,161,6)

def resize_and_timestamp(target_folder, output_folder, filename, file_number):
	img = Image.open(os.path.join(target_folder, filename))

	# resize
	widthtarget = 1920
	heighttarget = 1080
	downSampleRatio = float(widthtarget) / float(img.width)
	img = img.resize( (widthtarget,round(img.height*downSampleRatio) ), resample=Image.LANCZOS)
	img = img.crop((0,180,widthtarget, heighttarget+180))

	# timestamp
	date, time = filename[:-4].split("_")
	year, month, day = date.split('-')
	date = '%s/%s/%s' % (month, day, year)
	time = ':'.join(time.split('-'))

	draw = ImageDraw.Draw(img)
	draw.text((img.width-230,img.height-160), date, fontcolor, font=fontsmall)
	draw.text((img.width-230,img.height-120), time, fontcolor, font=font)

	# save
	img.save('%s/%s' % (output_folder, 'IMG_%04d.jpg' % file_number))

def reader_process(i, queue, target_folder, output_folder):
		while True:
				count, filename = queue.get()
				if (filename == 'DONE'):
					break
				print("Image %02d: %s (core=%s)" % (count, filename, i))
				resize_and_timestamp(target_folder, output_folder, filename, count)

def main(folder_name):
	target_folder = os.path.join(base_path, folder_name)

	output_folder = '%s-timestamp' % target_folder
	if not os.path.exists(output_folder):
		os.makedirs(output_folder)

	# Add pictures to queue
	queue = Queue()
	count = 0
	for i in os.listdir(target_folder):
		if not i.endswith(".jpg"):
			continue
		count += 1
		queue.put((count, i))

	for p in range(core_count):
			queue.put((-1, 'DONE'))

	processes = [Process(target=reader_process, args=(x + 1, queue, target_folder, output_folder)) for x in range(core_count)]

	for p in processes:
			p.start()

	for p in processes:
			p.join()

	print('Finished')

if __name__ == '__main__':
	if not sys.argv[1]:
		sys.exit('folder name is required')
	main(sys.argv[1])
