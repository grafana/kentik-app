var metricList = [
  {text: 'Traffic', value: 'Traffic', field: 'f_sum_both_bytes'},
  {text: 'Geography Src', value: 'Geography_src', field: 'src_geo'},
  {text: 'IP Src', value: 'IP_src', field: 'ipv4_src_addr'},
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
    }
  },
  {
    text: 'Packets/s',
    value: 'packets',
    field: 'f_sum_both_pkts',
    gfUnit: "pps",
    gfAxislabel: 'Packets/s',
    transform: function(value, row) {
      return value / row.i_duration;
    }
  },
  {
    text: 'Unique Dst IPs',
    value: 'unique_dst_ip',
    field: 'uniquesrcips',
    gfUnit: "short",
    gfAxisLabel: "Unique Dst IPs",
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

