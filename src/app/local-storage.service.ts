import { Injectable } from '@angular/core';

import { AppConfig } from './app-config';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  config!: AppConfig;

  constructor() {
    this.loadConfig();
  }

  loadConfig(): AppConfig {
    const item = localStorage.getItem('appConfig');

    if (!item) {
      this.initConfig();
      this.writeConfig();
      return this.config;
    }

    const data = JSON.parse(item);
    const defaultConfig = this.getDefaultConfig();

    this.config = {
      hashLength: data.hashLength || defaultConfig.hashLength,
    };

    return this.config;
  }

  initConfig(): void {
    this.config = this.getDefaultConfig();
  }

  getDefaultConfig(): AppConfig {
    return {
      hashLength: 8,
    };
  }

  writeConfig(): void {
    if (!this.config) throw new Error('App config is empty');

    localStorage.setItem('appConfig', JSON.stringify(this.config));
  }

  getItem(key: keyof AppConfig): AppConfig[typeof key] {
    return this.config[key];
  }

  setItem(key: keyof AppConfig, value: AppConfig[typeof key]): void {
    this.config[key] = value;
    this.writeConfig();
  }
}
