"""
爬取人物头像
来源：游戏《三国志11》
"""
from urllib.request import urlopen, urlretrieve
from bs4 import BeautifulSoup
from collections import defaultdict
import regex as re
from chapter_parser import parse_chapter, load_page, load_table
import pandas as pd
import sys

def load_urls(base_url):
    html = urlopen(base_url)
    bs = BeautifulSoup(html.read(), 'html.parser')
    nav = bs.find("div", {"id":"w"}).find_all("p")[2]
    links = nav.find_all("a")
    rel_urls = []
    for link in links:
        rel_urls.append(link['href'])
    rel_urls = rel_urls[:-3]
    urls = [base_url]
    for rel_url in rel_urls:
        urls.append(base_url+rel_url)      
    return urls

def crawl_avatars(url):
    base = url.split('/11/')[0]
    html = urlopen(url)
    bs = BeautifulSoup(html.read(), 'html.parser')
    officers = bs.find_all('div', {'class':'officers'})
    for officer in officers:
        links = officer.find_all('a')
        for link in links:
            img = link.img['src']
            name = link.img['alt']
            name = name.split(' ')
            name = '-'.join([x.lower() for x in name])
            img_url = base + img           
            urlretrieve(img_url, './image/' + name + '.jpg')

if __name__ == '__main__':
    urls = load_urls('http://kongming.net/11/portraits/')
    for url in urls:
        crawl_avatars(url)