import os
import typing


def isCRLF(fileAbsPath:str):
    with open(fileAbsPath, "rb+") as f:
        data = f.read(8192)
        if b"\r\n" in data:
            return True
        elif b"\n" in data:
            return False


def changeToLF(fileAbsPath:str):
    with open(fileAbsPath, "w+") as f:
        tmp = f.read()
        newdata = tmp.replace(r"\r\n", r"\n")
        f.write(newdata)


def main(targetFolders: typing.Sequence = [], targetSuffixs: typing.Sequence = []):
    if not targetFolders:
        targetFolders = [f"{os.getcwd()}"]
    if not targetSuffixs:
        print("Please appoint file suffixs")
        return
    
    for i in targetFolders:
        for root, dirs, files in os.walk(f"{os.getcwd()}/{i}"):
            # 检查后缀
            eligibleFilesOnSuffix = filter(
                lambda x: any(x.endswith(ext) for ext in targetSuffixs),
                files
            )
            # 拼上 parent path
            eligibleFilesAbsPathOnSuffix = map(
                lambda fname: os.path.join(root, fname),
                eligibleFilesOnSuffix
            )
            
            # 查出EOL是CRLF的文件
            eligibleFilesOnEOL = filter(isCRLF, eligibleFilesAbsPathOnSuffix)
            
            # 依次修改文件的EOL为LF
            for f in eligibleFilesOnEOL:
                changeToLF(f)


if __name__ == "__main__":
    targetFolders = ["src"]
    targetSuffixs = [".js", ".css", ".html"]
    main(targetFolders, targetSuffixs)
    print("done")