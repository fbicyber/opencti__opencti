FROM tim_python_v3.10:latest

COPY src /opt/opencti-worker

WORKDIR /opt/opencti-worker

#  requirements.txt must have pycti removed
RUN sed -i 's/^pycti==.*$//' /opt/opencti-worker/requirements.txt \
    && cat /opt/opencti-worker/requirements.txt

RUN apk --no-cache add build-base libmagic libffi-dev \
    && pip3 install --no-cache-dir --requirement requirements.txt \
    && pip3 install --upgrade pip --force --no-cache-dir \
    && apk del build-base

CMD ["python", "worker.py"]
