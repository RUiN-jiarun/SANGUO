from urllib.request import urlopen
from bs4 import BeautifulSoup
from collections import defaultdict
import re

class EntryParser:
    
    @staticmethod
    def count_name(text, adj):
        """add name in text (string) into defaultdict self.adj;
        Two consecutive words starting with capital letters is considered as a name"""
        for x in re.finditer(r'[A-Z][a-z]*[\s][A-Z][a-z]*',text):
            adj[x.group()] += 1
        return

    @staticmethod
    def load_page(url):
        """Return a BeautifulSoup object of a given url if exists or None"""
        try:
            url = 'https://en.wikipedia.org'+url
            html = urlopen(url)
            bs = BeautifulSoup(html.read(),'html.parser')
        except:
            #if page not exists or page not found
            return None     
        return bs

    @staticmethod
    def read_page(bs, adj):
        """Count name in the bs object"""
        paragraphs = bs.find('div',{'id':'bodyContent'}).find_all('p')
        for p in paragraphs:
            EntryParser.count_name(p.text, adj)
        return adj

    @staticmethod
    def edges_to(url):
        '''
        :type url: str
        :rtype: dict
        '''
        adj = defaultdict(int)
        bs = EntryParser.load_page(url)
        if bs:
            return EntryParser.read_page(bs, adj)
        return 

if __name__=='__main__':
    print(EntryParser.edges_to('/wiki/Liu_Bei'))