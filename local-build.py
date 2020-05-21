#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Top level script to build/package server and client components
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

client_npm_install_command = "npm --prefix client/chit-chat install"
# Safe to invoke shell=True as command is not formed from external inputs
check_call(client_npm_install_command, shell=True)
print("NPM install command finished")

client_npm_build_command = "npm --prefix client/chit-chat run build"
check_call(client_npm_build_command, shell=True)
print("NPM build command finished")

client_npm_test_command = "CI=true npm --prefix client/chit-chat test"
check_call(client_npm_test_command, shell=True)
print("NPM test command finished")

copy_file_tree("client/chit-chat/build", "server/chit-chat/src/main/resources/public")
print("Client UI artifacts copied to server resources area")

server_build_command = "mvn clean -B package " \
                        "--file server/chit-chat/pom.xml -e"
check_call(server_build_command, shell=True)
print("Maven build finished")
