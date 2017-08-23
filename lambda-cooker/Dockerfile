FROM amazonlinux
RUN yum install -y \
  git-core \ 
  zlib-devel \
  make \
  automake \
  gcc \
  gcc-c++ \
  kernel-devel \
  sqlite-devel
RUN git clone https://github.com/mapbox/tippecanoe.git
WORKDIR /tippecanoe
RUN make
RUN mkdir /output
