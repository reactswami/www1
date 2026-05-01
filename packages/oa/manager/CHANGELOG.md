# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## UNRELEASED

## [0.0.2] - 2022-12-12

### ADDED

- Add the location field to the OA form,
- Review types to include location,

### MODIFIED

- Consolidate all the toast messages in the same file,
- Review the styling of the assign poller form,

### FIXED

- Fix queries requesting the wrong data,
- Fix an issue where the empty table state was not connected to the add oa modal,

### MODIFIED

- Allow empty latitude, longitude,
- Autoclose the OA edition modal on success
- Put all the toast messages together, ideally this should be part of the ReactQuery lib and exported as a lib...

### [0.0.1]

This project has been created by breaking down the previous development of OA which grouped the ping pages as well as the oa manager.
For more information, you can check commits prior to f2dc0acdf56436051c6b8e381c86643740402d8c.
