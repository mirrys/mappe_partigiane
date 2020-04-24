tippecanoe -o "25april.mbtiles" \
	--layer="25april" \
	--read-parallel \
	--generate-ids \
	--drop-densest-as-needed --extend-zooms-if-still-dropping \
	-z18 -Z4 \
	--force "../geojson/final_tile.geojson"