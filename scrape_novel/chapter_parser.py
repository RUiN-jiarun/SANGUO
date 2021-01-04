"""
爬取网页人名，按章回分析
"""
from urllib.request import urlopen
from bs4 import BeautifulSoup
from collections import defaultdict
import regex as re
import pandas as pd
import numpy as np

def load_table(people_file):
    '''
    :param people_file: Path to the .csv file that stores the valid names
    :type people_file: str
    :return: A dictionary of valid names
    :rtype: defaultdict
    '''
    names = defaultdict(bool)
    df = pd.read_csv(people_file)
    lnames = df['name_en'].values
    # Name translate dictionary
    trans_dict = dict(zip(df.values[:, 0], df.values[:, 1]))

    new_names = np.array(['Emperor Xian', 'Diao Chan', 'Yue Jing', 'Zhang Ba', 'Zhang Jue', 'Zhang Lian',
    'Zhao Zilong', 'Lu Bu', 'Lu Meng', 'Lu Qian', 'Hu Ban', 'Gao Ding', 'Zhou Cang', 'The Emperor'])
    lnames = np.concatenate((lnames, new_names))
    for name in lnames:
        names[name] = True

    return names, trans_dict

def load_page(url):
    '''
    :param url: URL of the target chapter
    :type url: str
    :return: BeautifulSoup object of url
    :rtype: bs4.BeautifulSoup
    '''
    try:
        html = urlopen(url)
        bs = BeautifulSoup(html.read(), 'html.parser')
    except:
        return None     
    return bs

def find_name(p):
    '''
    :param p: Text of a paragraph
    :type p: str
    :return: Names appear in p; unique and all
    :rtype: set, list
    '''
    names = set()
    all_names = []
    for x in re.findall(r'[A-Z][a-z]*[\s][A-Z][a-z]*', p, overlapped=True):

        if x == 'Zhao Zilong':
            x = 'Zhao Yun'
        if x == 'Zhang Ba':
            x = 'Zhang Bao (2)'
        if x == 'Yue Jing':
            x = 'Yue Jin'
        if x == 'The Emperor':
            x = 'Emperor Xian'
        if x == 'Wen Ping':
            x = 'Wen Pin'
        if x == 'Guan Lu':
            x = 'Guan Luo'
        if x == 'Zhang Lian':
            x = 'Zhang Liang'

        names.add(x)   
        all_names.append(x)
    return names, all_names

def add_edges(g, names):
    '''
    :param g: Graph to store edges
    :type g: defaultdict
    :param names: A set of names
    :type names: set
    :rtype: None
    '''
    names = sorted(list(names))
    n = len(names)

    for i in range(n-1):
        for j in range(i+1, n):
            pair = (names[i], names[j])
            g[pair] += 1

def drop_names(g, valid_names):
    '''
    :param g: Graph that stores edges
    :type g: defaultdict
    :param valid_names: Table that stores the valid names
    :type valid_names: defaultdict 
    :rtype: None
    '''
    keys = list(g.keys())
    for pair in keys:
        if pair[0] not in valid_names or pair[1] not in valid_names:
            del g[pair]

def drop_counts(c, valid_names):
    '''
    :rtype: None
    '''
    keys = list(c.keys())
    for key in keys:
        if key not in valid_names:
            del c[key]


def parse_chapter(url, valid_names):
    '''
    :param url: URL of the target chapter
    :type url: str
    :return: graph of the people appeared in this chapter; the appearance count for each person
    :rtype: defaultdict, defaultdict
    '''
    bs = load_page(url)
    graph = defaultdict(lambda:0)
    count = defaultdict(lambda:0)

    paragraphs = bs.find('table',{'id':'txt_content'}).find_all('td', {'class': "1"})
    for p in paragraphs:
        names, all_names = find_name(p.text)
        if len(names) > 1:
            add_edges(graph, names)
        for name in all_names:
            count[name] += 1

    drop_names(graph, valid_names)
    drop_counts(count, valid_names)

    return graph, count


if __name__ == "__main__":
    valid_names, trans_dict = load_table("./data/people.csv")
    # print(trans_dict)
    parse_chapter("https://www.threekingdoms.com/001.htm", valid_names)


    







