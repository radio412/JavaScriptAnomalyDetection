JavaScriptAnomalyDetection
==========================

These functions can determine clusters of data and then also identify values which do not identify with any derived cluster and delcare them outliers. You can use this code to determine anomalous behavior in a system wuth established patterns of behavior.

An exmaple use is to use the clustering detection to find very near RGB color values in a css file, and then once detected, convert those colors to a single RGB/Hex to reduce pointless color variations in the css file usually caused by different developers sampling colors from a design file with an eyeedrop tool.

It works by using a traditional linear sort to create an ordered list. The function then uses a gallop to identify a spectrum of differentiation among the values in the list. This spectrum is then used to determine boundaries of clusters and palce values into discrete groups.
