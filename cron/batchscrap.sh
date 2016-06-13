#!/usr/bin/env bash

BASE_DIR=~/dev/tipi/

function scrapnproc {
	cd "$BASE_DIR"/r-scripts/"$1"
	if [ $3 = "sp" ]
	then
		Rscript $2-escrapeo-unif.R
		Rscript $2-procesamiento-incremental.R
	elif [ $3 = "p" ]
	then
		Rscript $2-procesamiento-incremental.R
	fi
}

scrapnproc serieA serieA sp
scrapnproc serieB serieB sp
scrapnproc serieD serieD sp
scrapnproc Diarios-Pleno DS-Comisiones sp
scrapnproc Diarios-Pleno DS-Pleno sp
