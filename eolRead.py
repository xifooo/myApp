import typing
import os
# from pathlib import Path


def walk(spec_folders: typing.Sequence = [], spec_suffixs: typing.Sequence = []) -> list:
    """
    walk 遍历当前目录下的指定的文件夹、指定后缀名的文件

    Args:
        spec_folders (typing.Sequence, optional): 指定的文件夹的名字. Defaults to [].
        spec_suffixs (typing.Sequence, optional): 指定的后缀. Defaults to [].

    Returns:
        list: 深度遍历指定文件夹后，过滤出的符合指定后缀名的文件
    """

    cwd = os.getcwd()
    
    spec_files = []
    spec_folders = map(lambda x: os.path.join(cwd, x), spec_folders)
    
    for fname in os.listdir(cwd):
        files_path = list(map(lambda x: os.path.join(cwd, fname), fname))
        filtered_files = filter(lambda x: any(x.endswith(ext) for ext in spec_suffixs), files_path)
        spec_files.extend(list(filtered_files))
    
    for i in spec_folders:
        for root, dirs, files in os.walk(i):
            files_path = list(
                map(
                    lambda x: os.path.join(root, x), 
                    files
                    )
                )
            filtered_files = filter(
                lambda x: any(x.endswith(ext) for ext in spec_suffixs), 
                files_path
                )
            spec_files.extend(list(filtered_files))
    
    return spec_files
    
# def detect_line_endings(filename):
#     with open(filename, 'rb') as f:
#         data = f.read(8192)
#     if b'\r\n' in data:
#         return 'CRLF'
#     else:
#         return 'LF'

def change_eol(spec_files: typing.Sequence = []):
    
    for fname in spec_files:
        
        with open(fname, "rb+") as f:
            data = f.read(8192)
            
            if b"\r\n" in data:
                filedata = f.read()
                newdata = filedata.replace("\r\n", "\n")
                f.write(newdata)


if __name__ == "__main__":
    spec_folders = ["controllers", "models"]
    # spec_folders = ["controllers", "models", "requests", "tests", "utils"]
    # spec_suffix = [".js", ".json", ".md", ".py", ".rest"]
    spec_suffix = [".jsjsjsjsjs"]
    spec_files = walk(spec_folders, spec_suffix)
    change_eol(spec_files)
    