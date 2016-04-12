var metricList = [
  {text: 'Traffic', value: 'Traffic', field: 'traffic'},
  {text: 'Geography Src', value: 'Geography_src', field: 'src_geo'},
  {text: 'IP Src', value: 'IP_src', field: 'ipv4_src_addr'},
  {text: 'Src Geo Region', value: 'src_geo_region', field: 'src_geo_region'},
];

var unitList = [
  {
    text: 'Bits/s',
    value: 'bytes',
    field: 'f_sum_both_bytes',
    gfUnit: "bps",
    gfAxisLabel: 'Bits/s',
    transform: function(value, row) {
      // transform from bytes to bits and
      // divide by interval
      return (value / 8) / row.i_duration;
    },
    tableFields: [
      {text: 'Max', field: 'max_both'},
      {text: '95th Percentile', field: 'p95th_both'},
      {text: 'Avg', field: 'f_sum_both_bytes'},
    ]
  },
  {
    text: 'Packets/s',
    value: 'packets',
    field: 'f_sum_both_pkts',
    gfUnit: "pps",
    gfAxislabel: 'Packets/s',
    transform: function(value, row) {
      return value / row.i_duration;
    },
    tableFields: [
      {text: 'Max', field: 'max_both'},
      {text: '95th Percentile', field: 'p95th_both'},
      {text: 'Avg', field: 'f_sum_both_pkts'},
    ]
  },
  {
    text: 'Unique Src IPs',
    value: 'unique_src_ip',
    field: 'uniquesrcips',
    gfUnit: "short",
    gfAxisLabel: "Unique Src IPs",
    tableFields: [
      {text: 'Max IPs per device', field: 'max_unique_src_ips_per_device'},
      {text: 'p95th mbps', field: 'p95th_bps'},
      {text: 'p95th pps', field: 'p95th_pps'},
    ]
  },
  {
    text: 'Unique Dst IPs',
    value: 'unique_dst_ip',
    field: 'uniquesrcips',
    gfUnit: "short",
    gfAxisLabel: "Unique Dst IPs",
    tableFields: [
      {text: 'Max IPs per device', field: 'max_unique_dst_ips_per_device'},
      {text: 'p95th mbps', field: 'p95th_bps'},
      {text: 'p95th pps', field: 'p95th_pps'},
    ]
  },
];

export {metricList, unitList};

        // "Geography_src",
        // "src_geo_region",
        // "src_geo_city",
        // "AS_src",
        // "InterfaceID_src",
        // "Port_src",
        // "VLAN_src",
        // "IP_src",
        // "src_route_prefix_len",
        // "src_route_length",
        // "src_bgp_community",
        // "src_bgp_aspath",
        // "src_nexthop_ip",
        // "src_nexthop_asn",
        // "src_second_asn",
        // "src_third_asn",
        // "src_proto_port",
        // "TopFlow",
        // "Proto",
        // "InterfaceTopTalkers",
        // "PortPortTalkers",
        // "RegionTopTalkers",
        // "TopFlowsIP",
        // "ASTopTalkers",
        // "TOS",
        // "Geography_dst",
        // "dst_geo_region",
        // "dst_geo_city",
        // "AS_dst",
        // "InterfaceID_dst",
        // "Port_dst",
        // "VLAN_dst",
        // "IP_dst",
        // "dst_route_prefix_len",
        // "dst_route_length",
        // "dst_bgp_community",
        // "dst_bgp_aspath",
        // "dst_nexthop_ip",
        // "dst_nexthop_asn",
        // "dst_second_asn",
        // "dst_third_asn",
        // "dst_proto_port"

