# -* coding: utf-8 *-
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
    df = pd.read_csv(people_file)
    # Name translate dictionary
    trans_dict = dict(zip(df.values[:, 1], df.values[:, 2]))

    return trans_dict

def getPower(born_state, trans_dict):
    bs = pd.read_csv(born_state)
    names = bs['name_zh'].values
    power = []
    for i in names:
        power.append(trans_dict[i])
    # print(power)
    bs['power'] = power
    bs.to_csv('scrape_born_state/data/map1.csv',index=None)






if __name__ == "__main__":
    trans_dict = load_table("scrape_born_state/data/people.csv")
    # print(trans_dict)
    # getPower('scrape_born_state/data/born_state.csv', trans_dict)
    