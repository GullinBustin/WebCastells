import cv2
import numpy
import time
import scipy.ndimage.measurements
from skimage import img_as_ubyte
import pprint
import json



pp = pprint.PrettyPrinter(indent=4)

#img = cv2.imread('newPinya3-lit - copia2.png',0)
#imgC = cv2.imread('newPinya3-lit - copia2.png',1)

img = cv2.imread('MarcTorre.png',0)
imgC = cv2.imread('MarcTorre.png',1)

im = numpy.ones([img.shape[0],img.shape[1],3])*255

threshold = 230

mask = img > threshold ;

im2, contours, hierarchy = cv2.findContours(img_as_ubyte(mask),cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE)

jsonData = []

for cnt in contours:
	#im = imgC.copy()
	rect = cv2.minAreaRect(cnt)
	box = cv2.boxPoints(rect)
	box = numpy.int0(box)

	cv2.drawContours(im,[box],0,(0,0,255),2)
	font = cv2.FONT_HERSHEY_SIMPLEX

	#cv2.putText(im,str(rect[2]),(int(rect[0][0]),int(rect[0][1])), font, 0.3,(255,0,0))
	'''
	cv2.imshow('im', im)
	cv2.waitKey(0)
	inVal = raw_input("posicio fila cordo costat: ")
	if(inVal != '-1'):
		posicio = inVal.split( )
		json = {
			"rect" : rect,
			"pos" : posicio
		}

		print json
		jsonData.append(json)
	'''

    
cv2.imshow('img',img_as_ubyte(mask))
cv2.imshow('im',im)

'''
with open('tres.json', 'w') as outfile:
    json.dump(jsonData, outfile)

print len(contours)
'''

cv2.waitKey(0)
