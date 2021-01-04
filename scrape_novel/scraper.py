from urllib.request import urlopen
from bs4 import BeautifulSoup
from collections import defaultdict
import regex as re
from chapter_parser import parse_chapter, load_page, load_table
import pandas as pd
import sys, os
from tqdm import tqdm

def build_graph(base_url, valid_names, start_chapter=1, end_chapter=120):
    '''
    :param base_url: URL to start scraping
    :type base_url: str
    :return: Combined Graph; Appearence Count
    :rtype: list, list
    '''

    graph = defaultdict(lambda:0)
    count = defaultdict(lambda:0)
    res1 = []
    res2 = []

    for j in range(start_chapter, end_chapter+1):
        if j < 10:
            url = base_url + '00' + str(j) + ".htm"
        elif j < 100:
            url = base_url + '0' + str(j) + ".htm"
        else:
            url = base_url + str(j) + ".htm"
        
        g, c = parse_chapter(url, valid_names)
        for key in g.keys():
            graph[key] += g[key]
        for key in c.keys():
            count[key] += c[key]

    for key in graph.keys():
        res1.append((key[0], key[1], graph[key]))
    for key in count.keys():
        res2.append((key, count[key]))

    res1.sort(key=lambda x: x[2], reverse=True)
    res2.sort(key=lambda x: x[1], reverse=True)

    return res1, res2

def add_images(count):
    # Add images to nodes
    nodes = []

    for node in count:
        name = node[0]
        value = node[1]
        new_name = name.split(' ')
        new_name = [x.lower() for x in new_name]
        new_name = '-'.join(new_name)
        if new_name == 'zhao-zilong':
            new_name = 'zhao-yun-(young)'

        if new_name == 'xiahou-dun':
            new_name = 'xiahou-dun-(patch)'

        if new_name in ['cao-cao', 'deng-ai', 'gan-ning', 
        'guan-yu', 'huang-zhong', 'jiang-wei', 'liu-bei', 'lu-bu', 
        'lu-meng', 'lu-xun', 'ma-chao', 'sima-yi', 'sun-ce', 'sun-quan',
        'xu-huang', 'xun-yu', 'zhang-fei', 'zhang-he', 'zhang-liao', 'zhou-yu',
        'zhuge-liang', 'zhao-yun']:
            new_name = new_name + '-(young)'

        if not os.path.exists('image/' + new_name + '.jpg'):
            nodes.append((name, value, 'undefined'))
        else:   
            nodes.append((name, value, new_name+'.jpg'))

    return nodes

def add_faction(nodes):
    # Add factions to nodes

    people = pd.read_csv('data/people.csv')

    for j in range(len(nodes)):
        node = nodes[j]
        name = node[0]
        faction = people[people.name_en==name].url.values
        if len(faction) == 0:
            nodes[j] = (node[0], node[1], node[2], 'Other')
        else:
            nodes[j] = (node[0], node[1], node[2], faction[0])
    
    return nodes


if __name__ == "__main__":
    valid_names, trans_dict = load_table("./data/people.csv")
    chapters = [(1,2), (3,9), (10, 24), (25, 33), (34, 50), (51, 85), (86, 104), (105, 120), (1,120)]
    for j in tqdm(range(len(chapters))):
        start, end = chapters[j]
        graph, count = build_graph("https://www.threekingdoms.com/", valid_names, start, end)
        nodes = add_images(count)

        nodes = add_faction(nodes)

        # Save edges
        df_graph = pd.DataFrame(graph, columns=['source', 'target', 'weight'])
        df_graph.to_json('./data/graph-' + str(start) + '-' + str(end) + '.json', orient='records')
        # Save nodes
        df_count = pd.DataFrame(nodes, columns=['name', 'count', 'image', 'faction'])
        df_count.to_json('./data/count-' + str(start) + '-' + str(end) + '.json', orient='records')
