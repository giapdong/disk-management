import fs from "fs";
import path from "path";
import { StatsNode } from "../interface";
import DiskError from "../bean/DiskError";
import ConsoleErrorHandler from "../bean/ConsoleErrorHandler";
import zlib from 'zlib';

export default class DiskFileSystem {

	static async generateSafeFilePath(filepath: string) {

		if (fs.existsSync(filepath)) {
			var files = fs.readdirSync(path.dirname(filepath));
			var filename = path.parse(filepath).name;
			var fileext = path.parse(filepath).ext;

			var index = 0;
			for (var i = 0; i < files.length; i++) {
				let file = files[i];
				let pattern = new RegExp(filename + "(\\s*\\((\\d+)\\)\\s*)?" + fileext);
				let match = file.match(pattern);
				if (match && match[2]) {
					var idx = parseInt(match[2]);
					if (idx > index) {
						index = idx;
					}
				}
			}

			index++;

			return path.join(path.dirname(filepath), `${filename} (${index})${fileext}`);
		}

		return filepath;
	}

	static async compressFile(data: any) {

		return zlib.deflateSync(Buffer.from(data), {level: zlib.Z_BEST_COMPRESSION});
	}


	/**
	 * @desc Read from encoded file and un-compress file data
	 * @param filepath
	 * @returns {Buffer}
	 */
	static async extractFile(filepath: string) {

		var tiny_txt = fs.readFileSync(filepath);

		var restore = zlib.inflateSync(Buffer.from(tiny_txt), {level: zlib.Z_BEST_COMPRESSION});

		return restore;
	}

	/**
	 * Simulation ls command familiar in UNIX, LINUX system
	 *
	 * @param {string} pathToDir Path to node in filesystem
	 */
	lsCommandPromise(pathToDir: string): Promise<string[]> {
		return new Promise((resolve, reject) => {
			if (fs.existsSync(pathToDir)) {
				fs.readdir(pathToDir, "utf-8", function (err, data) {
					return err ? reject(err) : resolve(data);
				});
			} else {
				resolve([]);
			}
		});
	}

  /**
   * Get directory status of element in dir
   *
   * @param pathToDir Path to one DIRECTORY in filesystem
   * @param dirInfo List item that dir contrain it
   */
  async readStatDirPromise(pathToDir: string, dirInfo: string[]): Promise<StatsNode[]> {
    try {
      const promise: Promise<StatsNode>[] = dirInfo.map(element => {
        return this.readStatPromise(path.join(pathToDir, element));
      });

      let dirNodes = await Promise.all(promise);
      dirNodes = dirNodes.filter(item => {
        if (item.stats.isSymbolicLink()) {
          return false;
        }

        return true;
      });
      return dirNodes;
    } catch (error) {
      DiskFileSystem.handleError("readStatDirPromise", error);
      new ConsoleErrorHandler(new DiskError(error));
      const newDirInfo = dirInfo.filter(item => path.join(pathToDir, item) != error.path);
      if (!newDirInfo.length) return [];

      return await this.readStatDirPromise(pathToDir, newDirInfo);
    }
  }

  /**
   * Write file using Promise
   *
   * @param {String} path Path to directory contain file
   * @param {JSON} data Stringtify of Object
   */
  writeFilePromise(path: string, data: any, options = "utf-8") {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, data, options, error => {
        return error ? reject(error) : resolve(1);
      });
    });
  }

  /**
   * Get status of FILE or DIRECTORY in filesystem
   *
   * @param {string} pathToNode Path to node in filesystem
   */
  async readStatPromise(pathToNode: string): Promise<StatsNode> {
    return new Promise((resolve, reject) => {
      fs.lstat(pathToNode, function (err, data) {
        const nodeStat: StatsNode = { path: pathToNode, stats: data };
        return err ? reject(err) : resolve(nodeStat);
      });
    });
  }

  /**
   * @desc Handle error
   *
   * @param {String} prefix Prefix for log
   * @param {JSON} data Any
   */
  static handleError(prefix: string, error: any) {
    if (error.code == "ENOTDIR" || error.errno == -20) {
    } else if (error.code == "ELOOP" || error.errno == -40) {
    } else if (error.code == "ENOENT" || error.errno == -2) {
      // resource not found, e.g: symlink
    } else if (error.code == "EBUSY" || error.errno == -4082) {
      // resource busy or locked
    } else if (error.code == "EACCES" || error.errno == -4092) {
      // resource permission denied
    } else if (error.code == "EPERM" || error.errno == -1) {
      // resource permission denied
    } else {
      console.log("\n", prefix, error);
    }
  }
}
