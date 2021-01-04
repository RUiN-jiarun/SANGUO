import pandas as pd

def count_people(fcsv,fout):
    df = pd.read_csv(fcsv)
    newdf = df.groupby(['url'])['name_en'].count().reset_index()
    newdf.columns = ['class','count']
    newdf.set_index(['class'],inplace=True)
    newdf.to_json(fout)

if __name__=="__main__":
    count_people("data/people.csv","data/count-people.json")

