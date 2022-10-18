clear;
clc;
close all;
%% import_data
in_path = ' '; 
csv_file = dir(fullfile(in_path,'*.csv'));
% num = length(csv_file);
% csv = fullfile(in_path,csv_file(1).name);

for num = 1:length(csv_file)
    csv = fullfile(in_path,csv_file(num).name);
    csv_import = importdata(csv);
    data = csv_import.data;
    detrend_data = detrend(data(:,4));
    head = {'x','y','year','detrend'};
    res_data = [data(:,1:3),detrend_data];
    [a,b]=size(res_data);
    res = mat2cell(res_data,ones(1,a),ones(1,b));
    res=[head;res];
    out_path =  ' '; 
    out_file = fullfile(out_path,csv_file(num).name);
    writecell(res,out_file);
    
    disp(csv)
    
end 
fprintf('All finished!')