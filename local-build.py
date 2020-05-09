#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Top level script to build/package server and ui components
"""
from os import getcwd
from subprocess import check_call

def copy_file_tree(src, dest):
    import shutil 
    import errno
    
    try:
        shutil.rmtree(dest)
        shutil.copytree(src, dest) 
    except OSError as err: 
        # error caused if the source was not a directory 
        if err.errno == errno.ENOTDIR: 
            shutil.copy2(src, dest) 
        else: 
            print("Copying error: % s" % err)

print("Current directory {0}".format(getcwd()))

ui_npm_install_command = "npm --prefix ui/chit-chat install"
# Safe to invoke shell=True as command is not formed from external inputs
check_call(ui_npm_install_command, shell=True)
print("NPM install command finished")

ui_npm_build_command = "npm --prefix ui/chit-chat run build"
check_call(ui_npm_build_command, shell=True)
print("NPM build command finished")

copy_file_tree("ui/chit-chat/build", "engine/chit-chat-server/src/main/resources/public")
print("UI artifacts copied to server resources area")

server_build_command = "mvn clean -B package " \
                        "--file engine/chit-chat-server/pom.xml -e"
check_call(server_build_command, shell=True)
print("Maven build finished")
