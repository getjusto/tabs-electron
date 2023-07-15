import './handleErrors'
import {app, BrowserWindow} from 'electron'
import App from './App'
import './autolaunch'
import './singleInstance'

App.main(app, BrowserWindow)
