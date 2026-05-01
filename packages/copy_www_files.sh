#!/bin/sh

# This script is only intended to run from the www/packages Makefile.
# Copy front end files to their final destination. Assumes script is
# run from the www/packages directory.

exit_error() {
   [ -n "$1" ] && echo "ERROR: $1" >&2
   exit 1
}

PKG_WK="$1"    # Directory of the front-end cache
DST_DIR="$2"   # Destination directory of front-end files for the Statseeker package

[ -d "$PKG_WK" ]  || exit_error "Front-end packages work directory not found '$PKG_WK'"
[ -n "$DST_DIR" ] || exit_error "Front-end package destination directory not set"

PROJ_LIST=`find . -type f -name 'project.json' | grep -v 'admin_tool\/license_upgrade'`
for proj in $PROJ_LIST
do
   # Find the cache directory where nx outputs its files
   cache_dir="${PKG_WK}/`jq -r '.targets.build.options.outputPath' "$proj"`"
   [ -d "$cache_dir" ] || exit_error "Failed to find front-end files to copy ${cache_dir}"

   # Check if this front end package needs to be built to a SCS directory outside of Statseeker
   dst_dir="$DST_DIR"
   src_dir=`dirname "$proj"`
   if [ -f "${src_dir}/Makefile" ]; then
      pkg_dst_dir=`gmake -s -C $src_dir print-DST_DIR`
      [ -n "$pkg_dst_dir" ] && dst_dir="$pkg_dst_dir"
   fi

   # Create the output directory and sync files across
   mkdir -p "$dst_dir/www"
   rsync -r -t -c -O -l "${cache_dir}/" "${dst_dir}/www"
done
