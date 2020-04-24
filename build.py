#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Top level script to build/package server and ui components
"""
from os import getcwd
from subprocess import check_call

print("Current directory {0}".format(getcwd()))

server_build_command = "mvn clean -B package " \
                        "--file engine/chit-chat-server/pom.xml -e"

# Safe to invoke shell=True as command is not formed from external inputs
check_call(server_build_command, shell=True)
                        
print("Build finished")
