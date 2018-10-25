# Change Log

All notable changes to this project will be documented in this file.

## [1.3.0] - 2018-10-22

### New Features

* Custom dimensions support [#46](https://github.com/grafana/kentik-app/issues/46)
* Direct filter import (using saved filters in Grafana) [#45](https://github.com/grafana/kentik-app/issues/45)

## [1.2.4] - 2017-05-22

### New Features

* Test for Kentik query builder

### Changed

* Enable stacking by default in Kentik top talkers dashboard

### Fixed

* Unique Src/Dst IPs metrics (after Kentik API update)
* Table data columns for Unique Src/Dst IPs metrics (now is Avg, p95th, Max, p95th mbps, p95th pps)
