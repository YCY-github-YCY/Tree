import xgboost as xgb
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
plt.style.use('seaborn')
import shap
from sklearn.model_selection import train_test_split


my_random_state =

data = pd.read_csv('  .csv')




cols = [' ',' ',' ', ' ', ' ', ' ',' ',' ',' ',' ', ' ', ' ',' ',' ',' ']




x_all = data[cols].values
y_all = data['y'].values

x_train, x_test, y_train, y_test = train_test_split(x_all, y_all,test_size=0.3, random_state=my_random_state)



model = xgb.XGBRegressor(max_depth=4, learning_rate=0.05, n_estimators=150)

model.fit(x_train, y_train)


# plt.figure(figsize=(15, 5))
# plt.bar(range(len(cols)), model.feature_importances_)
# plt.xticks(range(len(cols)), cols, rotation=-45, fontsize=14)
# plt.title('Feature importance', fontsize=14)
# plt.show()



explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(data[cols])

# print(shap_values.shape)
# y_base = explainer.expected_value
# print(y_base)

# data['pred'] = model.predict(data[cols])
# print(data['pred'].mean())

shap.summary_plot(shap_values, data[cols])
shap.summary_plot(shap_values, data[cols], plot_type="bar")
shap.dependence_plot(' ', shap_values, data[cols], interaction_index=None, show=False)
shap.dependence_plot(' ', shap_values, data[cols], interaction_index=None, show=False)
shap.dependence_plot(' ', shap_values, data[cols], interaction_index=None, show=False)
shap.dependence_plot(' ', shap_values, data[cols], interaction_index=None, show=False)
shap.dependence_plot(' ', shap_values, data[cols], interaction_index=None, show=False)
shap.dependence_plot(' ', shap_values, data[cols], interaction_index=None, show=False)
shap.dependence_plot(' ', shap_values, data[cols], interaction_index=None, show=False)
shap.dependence_plot(' ', shap_values, data[cols], interaction_index=None, show=False)
shap.dependence_plot(' ', shap_values, data[cols], interaction_index=None, show=False)
shap.dependence_plot(' ', shap_values, data[cols], interaction_index=None, show=False)
shap.dependence_plot(' ', shap_values, data[cols], interaction_index=None, show=False)
shap.dependence_plot(' ', shap_values, data[cols], interaction_index=None, show=False)
shap.dependence_plot(' ', shap_values, data[cols], interaction_index=None, show=False)
shap.dependence_plot(' ', shap_values, data[cols], interaction_index=None, show=False)
shap.dependence_plot(' ', shap_values, data[cols], interaction_index=None, show=False)
shap_df = pd.DataFrame(shap_values,columns = cols)
shap_df.to_csv(' .csv')