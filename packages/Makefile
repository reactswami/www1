#
# All software Copyright 2023 of Techniche Technologies Pty Ltd., All rights reserved.
# Any redistribution or reproduction of part or all of the contents in any form is
# prohibited without express written permission of the company.
#

include ../../cm/Makefile.globals
include $(SRC_ROOT)/cm/Makefile.inc

# Makefile.inc checks if WORKDIR exists
SRC_WORKDIR := $(WORKDIR)/ss_www_workdir
WWW_WORKDIR := $(SRC_WORKDIR)/www

# Not building using this file, just sourcing the BUILD_DIR

# Build in production unless DEVEL=1, then run it in development mode.
VITE_MODE := production
ifdef DEVEL
 VITE_MODE := development
endif

# Add an option to bypass cache and run over all, rather than just affected
SKIP_CACHE_FLAG :=
ifdef SKIP_CACHE
 SKIP_CACHE_FLAG := --skip-nx-cache
endif

# Define makefile targets that can be run
.PHONY: sync_www_workdir update_node_modules build_packages
default: build_packages

# Copy all www files to a cache/work directory. The reason for this:
#  - Offers flexibility that we can edit files such as project.json without modifying
#    the source (a pattern we've worked to avoid in the past).
#  - Offers flexibilty that front-end build systems can add or modify files
#    in the cache directory freely.
#  - Node modules will no longer be required in the source directory.
#  - Distribution directory 'www/dist/...' folder no longer needs to live in the source.
#    NOTE: If you want to move or add more dist folders, you may need to update the rsync
#    command below.
#  - A convenient place for the nx cache.
#
# Bascially, all cached front-end files can now live in a single place, and we don't
# need to impose our logic and build systems on front-end build tools like nx.
sync_www_workdir:
	@echo -e "\033[0;32mSyncing www work directory\033[0m"
	@mkdir -p $(WWW_WORKDIR)
	@rsync --exclude 'node_modules' --exclude '.nxcache' --exclude '/dist' -r -t -c -O -l --delete $(SRC_ROOT)/www/ $(WWW_WORKDIR)
	@rsync -r -t -c -O -l --delete $(SRC_ROOT)/.git/ $(SRC_WORKDIR)/.git


# Always make sure the node modules are up-to-date in the cache/work directory
update_node_modules: sync_www_workdir
	@echo -e "\033[0;32mUpdating node modules\033[0m"
	@cd $(WWW_WORKDIR) && yarn $(SILENT_FLAG_REDIRECT)


# In silent mode grep nx output for which task failed if any (grep exit code needs to be inverted)
NX_SILENT_FLAG :=
ifdef SILENT_FLAG_REDIRECT
	NX_SILENT_FLAG := | grep "Tasks not run" -A2; if [ $$? -eq 0 ]; then false; else true; fi
endif


# Build all www packages using a single nx command. The parallel flag is used to speed up the build process,
# and is determined by a variable in Makefile.globals NX_THREADS. This can be overriden like other flags such as
# DEVEL when running gmake.
#
# TODO: For the --exclude=ui-library,select-table, we might want to add a .nxignore file in www: https://nx.dev/reference/nxignore
# What we are doing is okay for now, though.
#
# Notes about what this is doing and why we are building this way:
#
#  - The nx command builds to a dist directory for each package within $(WWW_WORKDIR)/dist/... and this
#    directory always stays the same for each front-end package, regardless of what branch is checked out.
#
#  - After the nx command is run, copy_www_files.sh copies cached files in $(WWW_WORKDIR)/dist to their final
#    locations in the Statseeker build directory. This copies Statseeker www files to $(BUILD_DIR)/ss-$(VERSION)/www
#    and copies SCS package www files to their appropriate directories like $(BUILD_DIR)/meraki-$(MERAKI_VERSION)/www.
#    These output directories define where the files will live on a Statseeker system.
#
#  - SCS front end packages such as the meraki-poller need a Makefile like the following to tell copy_www_files.sh
#    where output files should go. All other front end packages don't need a Makefile and will be copied to Statseeker
#    www directory:
#
#       www/packages/scs/meraki-poller/Makefile
#       ```
#       include ../../../../cm/Makefile.inc
#       include $(SRC_ROOT)/modules/spe/meraki/Makefile.package
#       ```
#
# Why not set nx to output directly to final locations?
#
#  - XXX Most important reason XXX
#    When the final output BUILD_DIR is cleaned manually by running a gmake clean, it clears out the www
#    directories. However, if the git repository hasn't changed and source files haven't changed after the
#    clean, nx won't attempt to copy files to their output directory again because existing output matches
#    what's cached. nx only checks the source files and git repository to determine if a build is needed,
#    it doesn't check if the output directory has been removed or modified. For this reason, I thought it
#    best that we tell nx to output to a place it can manage itself without us deleting or moving the output
#    files from underneath it. There may be other edge cases that work better this way with nx cache behaviour,
#    rather than changing output directory depending on branch.
#
#  - Found it was conceptually simpler not modifying the project.json to tell nx to rebuild to different output
#    directories depending on branch.
#
#  - nx has now been set to deleteOutputPath 'true' within each project.json, and we set each package to have
#    its own independent destination path, not using a shared destination path. Setting this option to 'true'
#    now works correcly now we don't run independant nx commands in parallel. It's quite important that nx
#    cleans up stale files from previous builds and branch changes now the output directory stays the same.
build_packages: update_node_modules
	@echo -e "\033[0;32mBuilding frontend packages\033[0m"
	@cd $(WWW_WORKDIR) && nx run-many $(SKIP_CACHE_FLAG) --targets=build --parallel=$(NX_THREADS) --mode='$(VITE_MODE)' --exclude=ui-library,select-table,license_upgrade $(NX_SILENT_FLAG)
	@echo -e "\033[0;32mCopying frontend packages\033[0m"
	@./copy_www_files.sh "$(WWW_WORKDIR)" "$(DST_DIR)"
	@echo -e "\033[0;32mFrontend build complete\033[0m"

test: update_node_modules
	@echo -e "\033[0;32mTesting frontend packages\033[0m"
	@cd $(WWW_WORKDIR) && nx run-many $(SKIP_CACHE_FLAG) -target=test --coverage --parallel=$(NX_THREADS) $(NX_SILENT_FLAG)
	@echo -e "\033[0;32mFrontend testing complete\033[0m"

