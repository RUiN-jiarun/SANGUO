import cv2
import numpy as np
import pandas as pd

img = cv2.imread('map/map.png')

def getPos():
    cv2.namedWindow("image")
    cv2.setMouseCallback("image", on_EVENT_LBUTTONDOWN)
    while(1):
        cv2.imshow("image", img)
        if cv2.waitKey(0)&0xFF==27:
            break
    cv2.destroyAllWindows()

l=[]
cnt = 2

def on_EVENT_LBUTTONDOWN(event, x, y, flags, param):
    if event == cv2.EVENT_LBUTTONDOWN:
        xy = "%d,%d" % (x, y)
        cv2.circle(img, (x, y), 1, (255, 0, 0), thickness = -1)
        # cv2.putText(img, xy, (x, y), cv2.FONT_HERSHEY_PLAIN,
        #             1.0, (0,0,0), thickness = 1)
        l.append(xy)
        global cnt
        print(cnt, end=' ')
        cnt += 1
        print(xy)
        cv2.imshow("image", img)

def count(filename):
    df = pd.read_csv(filename)
    state = set(df['jun'].values)
    # print(state)
    for i in state:
        tmpdf = df[df['jun']==i]
        print(i)
        cnt = tmpdf['power'].value_counts()
        print(cnt)




if __name__ == '__main__':
    # count('scrape_born_state/data/map1.csv')    
    getPos()
    print(l)
    # bs = pd.read_csv('scrape_born_state/data/map1.csv')
    # bs['pos'] = l
    # bs.to_csv('scrape_born_state/data/map2.csv',index=None)