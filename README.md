# minimap2_chaining_plot_web
This git is the codes of the webpage (http://bcazaux.polytech-lille.net/Minimap2/) which illustrates the chaining section of the article A survey of mapping algorithms in the long-reads era by Sahlin et al.

Two sequences (for instance a read on the Y axis and a reference genome on the X axis) share k-mers or more generally subsequences called anchors.

In our example, anchors are represented using dots. The chaining step of long read mappers aims at retrieving the best chain according to a score function.

We present examples voluntarily simple, but with secondary chains and some noise. The best score chained has a different color. The chain's score is computed using the different anchors' scores, that can be displayed by ticking "See scores".

