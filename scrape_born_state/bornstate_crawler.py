# -* coding: utf-8 *-
from urllib.parse import quote
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

def crawl_born_state(name):
    try:
        url = 'http://www.e3ol.com/biography/html/' + quote(name) + '/'
        html = urlopen(url)
        bs = BeautifulSoup(html.read(),'html.parser')
        born_raw = str(bs.findAll('li', {'class': 'div_text'})[1])
        born = born_raw.split('：')[1].split('(')[0]
        zhou = born[:2]
        jun = born[2:-1]
        print(name, zhou, jun)
        return (name, zhou, jun)
    except:
        return None


if __name__ == "__main__":
    valid_names, trans_dict = load_table("./data/people.csv")
    for key, val in trans_dict.items():
        crawl_born_state(val)

