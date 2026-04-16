// This file is created by egg-ts-helper@2.1.1
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportAuth = require('../../../app/controller/auth');
import ExportFile = require('../../../app/controller/file');
import ExportHome = require('../../../app/controller/home');
import ExportProject = require('../../../app/controller/project');
import ExportSso = require('../../../app/controller/sso');

declare module 'egg' {
  interface IController {
    auth: ExportAuth;
    file: ExportFile;
    home: ExportHome;
    project: ExportProject;
    sso: ExportSso;
  }
}
