# Elastic-Scripts
In this repo, you find examples of script for delete index a each page of Elastic 

<p> Currently, users find problems with delete index manually. However, i development 3 scripts that could help you.<p>

<h4> The first script it is *list_all_indices.js*, with him, you can list your indices according to health of each index. Remember that, you could delete indice with health *green*. The reason that, you can search.</h4>

<h4> The script *delete_by_indice*, you could delete index specific. Set the environments.</h4>

<h4> The mainly script, *delete_by_indice*, you need pay attention for that. There, your proposital it's list green health indices, delete by pages each of indices, because, each indices, have indices-on-indice (it's crazy, of course), and then, in indices-on-indice have 10 id's inner (normally).</h4>