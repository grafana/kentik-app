var metricList = [
  {text: 'Traffic', value: 'Traffic', field: 'traffic'},
  {text: 'Source Country', value: 'Geography_src', field: 'src_geo'},
  {text: 'Source Geo Region', value: 'src_geo_region', field: 'src_geo_region'},
  {text: 'Source Geo City', value: 'src_geo_city', field: 'src_geo_city'},
  {text: 'Source As Number', value: 'AS_src', field: 'src_as'},
  {text: 'Source Interface', value: 'InterfaceID_src', field: 'input_port'},
  {text: 'Source Port', value: 'Port_src', field: 'input_port'},
  {text: 'Source VLAN', value: 'VLAN_src', field: 'vlan_in'},
  {text: 'Source IP/CIDR', value: 'IP_src', field: 'ipv4_src_addr'},
  {text: 'Source Route Prefix/LEN', value: 'src_route_prefix_len', field: 'src_route_prefix_len'},
  {text: 'Source Route LEN', value: 'src_route_length', field: 'src_route_length'},
  {text: 'Source BGP Community', value: 'src_bgp_community', field: 'src_bgp_community'},
  {text: 'Source BGP AS_Path', value: 'src_bgp_aspath', field: 'src_bgp_aspath'},
  {text: 'Source BGP Next Hop IP/CIDR', value: 'src_nexthop_ip', field: 'ipv4_src_next_hop'},
  {text: 'Source Next Hop AS Number', value: 'src_nexthop_asn', field: 'src_nexthop_as'},
  {text: 'Source 2nd BGP_HOP AS Number', value: 'src_second_asn', field: 'src_second_asn'},
  {text: 'Source 3nd BGP_HOP AS Number', value: 'src_third_asn', field: 'src_third_asn'},
  {text: 'Source Protocol:IP Port', value: 'src_proto_port', field: 'src_proto_port'},
  {text: 'Destination Country', value: 'Geography_dst', field: 'dst_geo'},
  {text: 'Destination Region', value: 'dst_geo_region', field: 'dst_geo_region'},
  {text: 'Destination City', value: 'dst_geo_city', field: 'dst_geo_city'},
  {text: 'Destination As Number', value: 'AS_dst', field: 'dst_as'},
  {text: 'Destination Interface', value: 'InterfaceID_dst', field: 'output_port'},
  {text: 'Destination Port', value: 'Port_dst', field: 'l4_dst_port'},
  {text: 'Destination VLAN', value: 'VLAN_dst', field: 'vlan_out'},
  {text: 'Destination IP/CIDR', value: 'IP_dst', field: 'ipv4_dst_addr'},
  {text: 'Destination Route Prefix/LEN', value: 'dst_route_prefix_len', field: 'dst_route_prefix_len'},
  {text: 'Destination Route LEN', value: 'dst_route_prefix_len', field: 'dst_route_length'},
  {text: 'Destination BGP Community', value: 'dst_bgp_community', field: 'dst_bgp_community'},
  {text: 'Destination BGP AS_Path', value: 'dst_bgp_aspath', field: 'dst_bgp_aspath'},
  {text: 'Destination BGP Next Hop IP/CIDR', value: 'dst_nexthop_ip', field: 'ipv4_dst_next_hop'},
  {text: 'Destination Next Hop AS Number', value: 'dst_nexthop_asn', field: 'dst_nexthop_as'},
  {text: 'Destination 2nd BGP_HOP AS Number', value: 'dst_second_asn', field: 'dst_second_asn'},
  {text: 'Destination 3nd BGP_HOP AS Number', value: 'dst_third_asn', field: 'dst_third_asn'},
  {text: 'Destination Protocol:IP Port', value: 'dst_proto_port', field: 'dst_proto_port'},
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

