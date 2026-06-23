function readPackage(pkg) {
  // Force ws to patched version
  if (pkg.dependencies && pkg.dependencies.ws) {
    pkg.dependencies.ws = '^8.21.0';
  }
  
  // Force uuid to patched version
  if (pkg.dependencies && pkg.dependencies.uuid) {
    pkg.dependencies.uuid = '^11.1.1';
  }
  
  return pkg;
}

module.exports = {
  hooks: {
    readPackage
  }
};
