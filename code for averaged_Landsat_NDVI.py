# -*- coding: utf-8 -*-


import pandas as pd
import json
import numpy as np
import sys
import os
from glob import glob

if len(sys.argv) != 3:
    print('''
    example:

    python get_mean.py dir_name dir_name
    ''')


in_dirname = sys.argv[1]
out_dirname = sys.argv[2]



if not (os.path.isdir(in_dirname) and os.path.isdir(out_dirname)):
    print('''
    arguments must be directory
    ''')

print('input file in {}, output file will in {}'.format(in_dirname, out_dirname))


for in_filename in glob(os.path.join(in_dirname, '*.csv')):

    print('process {}'.format(in_filename))

    df = pd.read_csv(in_filename)
    df['mean'] = df.apply(lambda x: np.mean(json.loads(x['NDVI'])), axis=1)
    out_filename = os.path.join(out_dirname, os.path.basename(in_filename)) 
    df[['X', 'Y', 'year', 'mean']].to_csv(out_filename, index=False)

