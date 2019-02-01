 /**
  * Returns the region associated with the kentik-ks

  * @param datasources 
  */
function getRegion(datasources: any): string {
  let aRegion = "default";
  for (var index in datasources) {
    if (datasources[index].type === "kentik-ds") {
      //console.log("getRegion: found region: " +datasources[index].jsonData.region);
      //console.log(allDS[index]);
      aRegion = datasources[index].jsonData.region;
      return aRegion;
    }
  }
  return aRegion;
}

export { getRegion }
