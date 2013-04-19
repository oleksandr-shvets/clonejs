echo ":: minify ::::::::::::::::::::::::::::::::::::::"

SRC_FILE=../src/clone.js
OUT_FILE=clone.min.js
 VERSION=`cat ../.version`

cd `dirname $0`/../build/

closure-compiler \
               --js $SRC_FILE \
   --js_output_file $OUT_FILE \
--create_source_map $OUT_FILE.map \
--source_map_format V3 \
      --language_in ECMASCRIPT5_STRICT \
--compilation_level SIMPLE_OPTIMIZATIONS \
    --use_types_for_optimization \
       --jscomp_off globalThis \
       --jscomp_off nonStandardJsDocs \
|| exit

# add header:
echo -e "// CloneJS.org $VERSION\r\n`cat $OUT_FILE`" > $OUT_FILE

# add link to source map:
echo "//@ sourceMappingURL=$OUT_FILE.map" >> $OUT_FILE