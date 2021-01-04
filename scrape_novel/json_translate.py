import json
import os
from chapter_parser import load_table


def trans_json_data(jsonfile, trans_dict):
    with open(jsonfile, 'rb') as f:
        params = json.load(f)
        if "count" in jsonfile:
            for i in range(len(params)):
                # print(params[i]['name'])
                if params[i]['name'] in trans_dict:
                    params[i]['name'] = trans_dict[params[i]['name']]
                elif params[i]['name'] == "Lu Bu":
                    params[i]['name'] = "吕布"
                elif params[i]['name'] == "Lu Meng":
                    params[i]['name'] = "吕蒙"
                elif params[i]['name'] == "Lu Qian":
                    params[i]['name'] = "吕虔"

                if params[i]['faction'] == "Wei":
                    params[i]['faction'] = "魏"
                elif params[i]['faction'] == "Shu":
                    params[i]['faction'] = "蜀"
                elif params[i]['faction'] == "Wu":
                    params[i]['faction'] = "吴"
                elif params[i]['faction'] == "Jin":
                    params[i]['faction'] = "晋"
                elif params[i]['faction'] == "Other":
                    params[i]['faction'] = "他"
            print("params", params)
            dic = params
        elif "graph" in jsonfile:
            for i in range(len(params)):
                if params[i]['source'] in trans_dict:
                    params[i]['source'] = trans_dict[params[i]['source']]
                elif params[i]['source'] == "Lu Bu":
                    params[i]['source'] = "吕布"
                elif params[i]['source'] == "Lu Meng":
                    params[i]['source'] = "吕蒙"
                elif params[i]['source'] == "Lu Qian":
                    params[i]['source'] = "吕虔"
                if params[i]['target'] in trans_dict:
                    params[i]['target'] = trans_dict[params[i]['target']]
                elif params[i]['target'] == "Lu Bu":
                    params[i]['target'] = "吕布"
                elif params[i]['target'] == "Lu Meng":
                    params[i]['target'] = "吕蒙"
                elif params[i]['target'] == "Lu Qian":
                    params[i]['target'] = "吕虔"
            print("params", params)
            dic = params
    f.close()
    return dic

def write_json_data(dict, jsonfile):
    with open(jsonfile, 'w', encoding='utf-8') as r:
        json.dump(dict, r, ensure_ascii=False)
    r.close()


if __name__ == "__main__":
    valid_names, trans_dict = load_table("./data/people.csv")
    lst = []
    lst_out = []
    for filename in os.listdir("./data/"):
        if filename[-4:] == "json" and filename != "count-people.json":
                lst.append(os.path.join("./data/", filename))
                lst_out.append(os.path.join("./data_trans/", filename))

    for i in range(len(lst)):
        dic = trans_json_data(lst[i], trans_dict)
        write_json_data(dic, lst_out[i])