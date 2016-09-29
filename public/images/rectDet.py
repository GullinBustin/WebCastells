import cv2
import numpy
import time
import scipy.ndimage.measurements
from skimage import img_as_ubyte
import pprint

pp = pprint.PrettyPrinter(indent=4)

img = cv2.imread('newPinya3-lit - copia2.png',0)

im = numpy.ones([img.shape[0],img.shape[1],3])*255

threshold = 230

mask = img > threshold ;

im2, contours, hierarchy = cv2.findContours(img_as_ubyte(mask),cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE)

for cnt in contours:
	im = img
	rect = cv2.minAreaRect(cnt)
	box = cv2.boxPoints(rect)
	box = numpy.int0(box)

	cv2.drawContours(im,[box],0,(0,0,255),0)
	font = cv2.FONT_HERSHEY_SIMPLEX

	cv2.putText(im,str(rect[2]),(int(rect[0][0]),int(rect[0][1])), font, 0.3,(255,0,0))
	cv2.imshow('im', im)

	print raw_input('What is your name? ')
    
cv2.imshow('img',img_as_ubyte(mask))


print len(contours)

cv2.waitKey(0)
